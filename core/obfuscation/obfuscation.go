package obfuscation

/*

  Handles payload obfuscation.

*/

import (
  "errors"
  "math/rand"
  "regexp"
  "strconv"
  "time"
)

type CodeSet struct {
  AfterSets  []int
  BeforeSets []int
  ID         int
  Imports    map[int]string
  NestedSets []int
  Variants   []string
}

var (
  CodeSetInterpreterAndroid []codeSet
  CodeSetInterpreterIOS     []codeSet
  CodeSetInterpreterLinux   []codeSet
  CodeSetInterpreterMacOS   []codeSet
  CodeSetInterpreterWindows []codeSet
  CodeSetRelayPhp           []codeSet
  CodeSetStagerAndroid      []codeSet
  CodeSetStagerIOS          []codeSet
  CodeSetStagerLinux        []codeSet
  CodeSetStagerMacOS        []codeSet
  CodeSetStagerWindows      []codeSet
)

func RandomString(length int) string {
  rand.Seed(time.Now().UnixNano())

  chars := []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
  buffer := ""
  for i := 0; i < length; i++ {
    index := rand.Intn(length)
    buffer += string(chars[index])
  }

  return buffer
}

// func ObfuscateSourceRandom(payload *[]byte, min_length, max_length int) ([]byte) {
//   // Count amount of obfuscatable strings
//   r := regexp.MustCompile(`obf_[a-zA-Z_]+`)
//   matches := r.FindAll(*payload, -1)

//   obfuscatable_count := 0
//   p := *payload
//   for i := 0; i < len(matches); i++ {
//     r = regexp.MustCompile(string(matches[i]))
//     if len(r.FindAll(p, -1)) > 0 {
//       p = r.ReplaceAll(p, []byte(""))
//       obfuscatable_count += 1
//     }
//   }

//   // Warn if payload has no variable names to obfuscate
//   if len(matches) == 0 {
//     log.Warn("payload has no variable names to obfuscate, prefix with obf_")
//   } else {
//     // Obfuscate payload's variable names with random ones
//     for i := 0; i < len(matches); i++ {
//       r = regexp.MustCompile(string(matches[i]))
//       rand.Seed(time.Now().UnixNano())
//       obf := RandomString(min_length + rand.Intn(max_length - min_length))
//       p = r.ReplaceAll(p, []byte(obf))
//     }
//   }

//   return p
// }

func ObfuscateSource(payload []byte, wordlist []string, shuffle bool) ([]byte, error) {
  // Count amount of obfuscatable strings
  r := regexp.MustCompile("obf_[a-zA-Z_]*")
  obf_matches := r.FindAll(payload, -1)

  count := 0
  p := payload
  for i := 0; i < len(obf_matches); i++ {
    r = regexp.MustCompile(string(obf_matches[i]))
    if len(r.FindAll(p, -1)) > 0 {
      p = r.ReplaceAll(p, []byte(""))
      count += 1
    }
  }

  // Make sure enough obfuscation strings are provided
  if len(wordlist) >= count {
    // Shuffle wordlist if shuffling is enabled
    if shuffle == true {
      // 
    }
    for i := 0; i < len(obf_matches); i++ {
      r = regexp.MustCompile(string(obf_matches[i]))
      payload = r.ReplaceAll(payload, []byte(wordlist[i]))
    }
  }

  return payload, nil
}

func ShuffleSource(codeSets []*CodeSet) ([]byte, error) {
  for a := 0; a < len(codeSets); a++ {
    this_set := codeSets[a]

    rand.Seed(time.Now().UnixNano())
    index := rand.Intn(len(this_set.NestedSets) + 1)
    nested_code := this_set.NestedSets[index]

    return nil, errors.New("code set " + strconv.Itoa(this_set.ID) + " is missing the following nested set of code: " + strconv.Itoa(this_nested_code.ID))
  }

  return nil, nil
}

// func RandomString(length int) string {
//   rand.Seed(time.Now().UnixNano())
//   chars := []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
//   buffer := ""
//   for i := 0; i < length; i++ {
//     index := rand.Intn(length)
//     buffer += string(chars[index])
//   }
//   return buffer
// }

/*

[]
[]
i
[]
[]
[""]

[]
[]
i
[]
[]
[""]

[]
[]
i
[]
[]
[""]

[]
[]
i
[]
[]
[""]

[]
[]
i
[]
[]
[""]

[]
[]
i
[]
[]
[""]

[2,3,4,5,6,7]
[]
8
[]
[]
["return buffer;"]

[]
[8]
7
[]
[]
["buffer += string(chars[index]);"]

[]
[8]
6
["math/rand"]
[]
["index := rand.Intn(length);","index := int(rand.Float64() * length);","index := int(length * rand.Float64());"]

[]
[8]
5
[]
[6,7]
["for i := 0; i < length; i++ {\n{{NESTED_CODE}}\n};"]

[2,3]
[2,3,8]
4
[]
[]
["buffer := \"\";"]

[2,4]
[2,4,8]
3
[]
[]
["chars := []byte(\"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\");"]

[3,4]
[3,4,8]
2
["math/rand","time"]
[]
["rand.Seed(time.Now().UnixNano());"]

[0]
[0]
1
["math/rand","time"]
[2,3,4]
["func RandomString(length int) string {\n{{NESTED_CODE}}\n};"]

[1]
[1]
0
["errors"]
[]
["func ShuffleSource(codeSets []codeSet) ([]byte, error) {\n{{NESTED_CODE}}\n};"]

*/