kubectl create -f frontend.yaml
kubectl create -f frontend-service.yaml


kubectl delete service node-service
kubectl delete pod node-hz.iilunin.com
