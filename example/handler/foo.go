package handler

import (
	"fmt"

	log "github.com/cihub/seelog"
	"github.com/hailocab/protobuf/proto"

	foo "github.com/hailocab/h2/example/proto/foo"
	"github.com/hailocab/h2/go"
	services "github.com/hailocab/h2/proto/discovery/proto/services"
)

func Foo(req h2.Request) (proto.Message, h2.Error) {
	request := req.Data().(*foo.Request)
	log.Debugf("Received bar=%v", request.GetBar())

	s := services.Response{}
	err := h2.Call("com.hailocab.kernel.discovery", "services", &services.Request{}, &s)
	if err != nil {
		log.Warnf("Ouch... the discovery services seems to be down ): %v", err)
	}
	rsp := &foo.Response{
		Baz: proto.String(fmt.Sprintf("There are %v services running on your h2 cluster", len(s.GetServices()))),
	}
	return rsp, nil
}
