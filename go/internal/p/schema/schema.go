package schema

import (
	"github.com/hailocab/protobuf/proto"

	"github.com/hailocab/h2/go/internal/p/errors"
	"github.com/hailocab/h2/go/internal/p/server"

	"github.com/hailocab/h2/go/internal/l/schema"
	schemaProto "github.com/hailocab/h2/go/internal/p/proto/schema"
	service "github.com/hailocab/h2/go/internal/p/server"
)

func Endpoint(name string, configStruct interface{}) *service.Endpoint {
	handler := func(req *server.Request) (proto.Message, errors.Error) {
		return &schemaProto.Response{
			Schema: proto.String(schema.Of(configStruct).String()),
		}, nil
	}

	return &server.Endpoint{
		Name:       name,
		Mean:       200,
		Upper95:    400,
		Handler:    handler,
		Authoriser: service.OpenToTheWorldAuthoriser(),
	}
}
