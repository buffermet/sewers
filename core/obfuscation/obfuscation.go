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
  ChildSets  []int
  ID         int
  Imports    []string
  ParentSet  int
  Variants   []string
}

var (
  CodeSetInterpreterAndroid []CodeSet
  CodeSetInterpreterIOS     []CodeSet
  CodeSetInterpreterLinux   []CodeSet
  CodeSetInterpreterMacOS   []CodeSet
  CodeSetInterpreterWindows []CodeSet
  CodeSetRelayPhp           []CodeSet
  CodeSetStagerAndroid      []CodeSet
  CodeSetStagerIOS          []CodeSet
  CodeSetStagerLinux        []CodeSet
  CodeSetStagerMacOS        []CodeSet
  CodeSetStagerWindows      []CodeSet
)

func RandomString(length int) string {
  rand.Seed(time.Now().UnixNano())

  chars := []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
  buffer := ""
  for i := 0; i < length; i++ {
    index := rand.Intn(length)
    buffer += string(chars[index])
  }

  return buffer
}

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

func getCodeSet(codeSets []*CodeSet, id int) (*CodeSet, error) {
  for i := 0; i < len(codeSets); i++ {
    this_set := codeSets[i]
    if this_set.ID == id {
      return this_set, nil
    }
  }
  return nil, errors.New("sets of code did not include set " + strconv.Itoa(id))
}

func getMainSets(codeSets []*CodeSet) []int {
  var main_sets []int
  for i := 0; i < len(codeSets); i++ {
    if codeSets[i].ParentSet != -1 {
      
    }
  }
}

func assemble(codeSets []*CodeSet, order []int, thisSet *CodeSet) string {
  index := rand.Intn(len(thisSet.ChildSets) + 1)
  child_id := thisSet.ChildSets[index]
  child_set, err := getCodeSet(codeSets, child_id)
  if err != nil {
    if len(child_set.ChildSets) > 0 {
      
    }
  }
}

  // AfterSets  []int
  // BeforeSets []int
  // ChildSets  []int
  // ID         int
  // Imports    []string
  // ParentSet  int
  // Variants   []string

func ShuffleSource(codeSets []*CodeSet) ([]byte, error) {
  var assembled []byte
  var imports []string
  source_prefix := []byte("package main\n\nimport (\n{{IMPORTS}}\n)\n\n{{ASSEMBLED}}")

  rand.Seed(time.Now().UnixNano())
  this_set := codeSets[a]

  this_source := assemble(codeSets, this_set)

  // return nil, errors.New("code set " + strconv.Itoa(this_set.ID) + " is missing the following nested set of code: " + strconv.Itoa(...))

  return b, nil
}

/*

[]
[]
[]
i
[]
-
[""]

[2,3,4,5,6,7]
[]
[]
8
[]
[1]
["return buffer;"]

[6]
[8]
[]
7
[]
[5]
["buffer += string(chars[index]);"]

[]
[7,8]
[]
6
["math/rand"]
[5]
["index := rand.Intn(length);","index := int(rand.Float64() * length);","index := int(length * rand.Float64());"]

[]
[8]
[6,7]
5
[]
[1]
["for i := 0; i < length; i++ {\n{{NESTED_CODE}}\n};"]

[2,3]
[2,3,8]
[]
4
[]
[1]
["buffer := \"\";"]

[2,4]
[2,4,8]
[]
3
[]
[1]
["chars := []byte(\"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\");"]

[3,4]
[3,4,8]
[]
2
["math/rand","time"]
[1]
["rand.Seed(time.Now().UnixNano());"]

[0]
[0]
[2,3,4,8]
1
["math/rand","time"]
[]
["func RandomString(length int) string {\n{{NESTED_CODE}}\n};"]

[1]
[1]
[]
0
["errors"]
[]
["func ShuffleSource(codeSets []CodeSet) ([]byte, error) {\n{{NESTED_CODE}}\n};"]

*/