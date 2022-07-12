exports.login_api = "/api/login"

exports.upload_floormap = "/api/uploadmap" 
exports.master_register = "/api/gateway/master"
exports.slave_register = "/api/gateway/slave"
exports.rackmonitor_register = "/api/rack"

exports.master_health= "/api/gateway/master"
exports.assettag_det = "/api/asset?rackno=all"
exports.asset_rack_det = "/api/rack?floorid="

exports.alerts_det = "/api/alert"
exports.asset_register = "/api/asset"

exports.alert_asset = "/api/alert?value=1" 
exports.alert_temp = "/api/alert?value=8"
exports.alert_humi = "/api/alert?value=9"
exports.alert_freefall = "/api/alert?value=3"

exports.racktemp = "/api/racktemp"
exports.racktemp_chart = "/api/rack/average?id="
exports.assettemp = "/api/assetemp"
exports.assettemp_chart = "/api/track?id="
