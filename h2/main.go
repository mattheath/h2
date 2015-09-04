package main

import (
	"fmt"
	"os"
	"os/exec"
)

func main() {
	if len(os.Args) == 0 {
		fmt.Println("No argument supplied")
	}
	switch os.Args[1] {
	case "setenv":
		setEnv()
	}
}

func setEnv() {
	cmd := exec.Command("docker-machine", "ls")
	out, err := cmd.Output()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(out))
}
