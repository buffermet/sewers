package core

/*
*	
*	Handles payload obfuscation.
*	
*/

import(
	"regexp"
	"math/rand"
	"time"
)

func RandomString(length int) string {
	rand.Seed( time.Now().UnixNano() )

	chars := []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	buffer := ""

	for i := 0; i < length; i++ {
		index := rand.Intn(length)

		buffer += string(chars[index])
	}

	return buffer
}

func ObfuscateRandom(payload []byte, min_length, max_length int) ([]byte, error) {
	// Count amount of obfuscatable strings
	r := regexp.MustCompile(`obf_[a-zA-Z_]*`)

	matches := r.FindAll(payload, -1)

	count := 0

	p := payload

	for i := 0; i < len(matches); i++ {
		r = regexp.MustCompile( string(matches[i]) )

		if len( r.FindAll(p, -1) ) > 0 {
			p = r.ReplaceAll( p, []byte("") )

			count += 1
		}
	}

	// Make sure enough obfuscation strings are provided
	for i := 0; i < len(matches); i++ {
		r = regexp.MustCompile( string(matches[i]) )

		rand.Seed( time.Now().UnixNano() )

		obf := RandomString( min_length + rand.Intn(max_length - min_length) )

		payload = r.ReplaceAll( payload, []byte(obf) )
	}

	return payload, nil
}

func ObfuscateWordlist(payload []byte, wordlist []string, shuffle bool) ([]byte, error) {
	// Count amount of obfuscatable strings
	r := regexp.MustCompile("obf_[a-zA-Z_]*")

	obf_matches := r.FindAll(payload, -1)

	count := 0

	p := payload

	for i := 0; i < len(obf_matches); i++ {
		r = regexp.MustCompile( string(obf_matches[i]) )

		if len( r.FindAll(p, -1) ) > 0 {
			p = r.ReplaceAll( p, []byte("") )

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
			r = regexp.MustCompile( string(obf_matches[i]) )

			payload = r.ReplaceAll( payload, []byte(wordlist[i]) )
		}
	}

	return payload, nil
}
