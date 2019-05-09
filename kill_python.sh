job_id=$(ps -fA | grep python | egrep http.server | tr -s ' ' | cut -d' ' -f 3)

if ! [ -z $job_id ]
then
	echo $job_id
	kill $job_id
fi
