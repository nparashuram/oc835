#!/usr/bin/env bash

IP=$1
USER=${CAM_USERNAME:-administrator}
PASS=${CAM_PASSWORD:-}
NAME=$2

curl "http://$USER:$PASS@$IP/adm/set_group.cgi?group=AUDIO&audio_in=1"
curl "http://$USER:$PASS@$IP/adm/set_group.cgi?group=AUDIO&audio_in2=1"

curl "http://$USER:$PASS@$IP/adm/set_group.cgi?group=BONJOUR&bonjour_name=$NAME"

curl "http://$USER:$PASS@$IP/adm/set_group.cgi?group=EVENT&event_trigger=1"
curl "http://$USER:$PASS@$IP/adm/set_group.cgi?group=EVENT&event1_entry=is=1|es=0,|et=2|acts=op1:0;op2:0;email:0;ftpu:0;im:0;httpn:0;httppost:1;wlled:0;smbc:0;sd:0;op3:0;op4:0;smbc_rec:0;sd_rec:0;poll:0|ei=0|ea=mp4,2,15,2|en=httppost"

curl "http://$USER:$PASS@$IP/adm/set_group.cgi?group=H264&bit_rate2=1000"
curl "http://$USER:$PASS@$IP/adm/set_group.cgi?group=H264&quality_type2=1"

curl "http://$USER:$PASS@$IP/adm/set_group.cgi?group=HTTP_EVENT&http_post_url=http://192.168.1.200:8080/upload/$NAME"

curl "http://$USER:$PASS@$IP/adm/set_group.cgi?group=OEM_REGISTER&register_status=1"
curl "http://$USER:$PASS@$IP/adm/set_group.cgi?group=OEM_REGISTER&register_gw=http://192.168.1.200:8080/api/register"


