package healthcheck

import (
	"github.com/hailocab/h2/go/internal/p/client"
)

// pubLastSample pings this healthcheck sample out into the ether
func pubLastSample(hc *HealthCheck, ls *Sample) {
	client.Pub("com.hailocab.monitor.healthcheck", healthCheckSampleToProto(hc, ls))
}
