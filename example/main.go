package main

import (
	"github.com/hailocab/h2/example/handler"
	foo "github.com/hailocab/h2/example/proto/foo"
	"github.com/hailocab/h2/go"
)

func main() {
	h2.NewService(
		"com.hailocab.service.template",
		"Please provide a short description of what your service does. It should be about this long.",
	).AddEndpoints(h2.Endpoint{
		Name: "foo",
		Func: handler.Foo,
		Req:  new(foo.Request),
		Resp: new(foo.Response),
	}).Run()
}
