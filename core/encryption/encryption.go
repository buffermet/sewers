package core

/*
*	
*	>> Use noise-protocol.
*	
*	Handles data encryption.
*	Keys are loaded from session configs.
*	
*/

import (
	"io"
	"log"
	"errors"
	"crypto/aes"
	"crypto/rand"
	"crypto/cipher"
	"encoding/base64"
)

func Encrypt(key, payload []byte) ([]byte, error) {
	blockcipher, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	encoded_payload := base64.StdEncoding.EncodeToString(payload)
	ciphertext := make( []byte, aes.BlockSize + len(encoded_payload) )

	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return nil, err
	}

	cfb := cipher.NewCFBEncrypter(blockcipher, iv)
	cfb.XORKeyStream( ciphertext[aes.BlockSize:], []byte(encoded_payload) )

	return []byte( base64.StdEncoding.EncodeToString(ciphertext) ), nil
}

func Decrypt(key, payload []byte) ([]byte, error) {
	blockcipher, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	payload, err = base64.StdEncoding.DecodeString( string(payload) )
	if err != nil {
		log.Fatal(err)
	}

	if len(payload) < aes.BlockSize {
		return nil, errors.New("ciphertext too short")
	}

	iv := payload[:aes.BlockSize]
	payload = payload[aes.BlockSize:]

	cfb := cipher.NewCFBDecrypter(blockcipher, iv)
	cfb.XORKeyStream(payload, payload)

	return payload, nil
}