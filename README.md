# DevOps Task Manager

A simple task manager web application demonstrating DevOps workflows with Node.js, Docker, and Kubernetes.

## Project Structure

- `app.js` - Express server serving frontend and REST API (`/health`, `/api/tasks`)
- `package.json` - Node.js project metadata and dependencies
- `index.html`, `style.css`, `script.js` - Simple Task Manager web interface
- `Dockerfile` - Container definition for the Node.js application
- `deployment.yaml` & `service.yaml` - Kubernetes Deployment and Service manifests (also available in `k8s/`)

---

## 1. Run Locally

```bash
# Install dependencies
npm install

# Start server (default: http://localhost:3000)
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Run with Docker

```bash
# Build Docker image
docker build -t task-manager:latest .

# Run container mapped to port 3000
docker run -d -p 3000:3000 --name task-manager task-manager:latest
```

---

## 3. Run on Kubernetes

```bash
# Apply deployment and service
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Check running pods and services
kubectl get pods
kubectl get services
```

If using Minikube or NodePort:
```bash
# Minikube service URL
minikube service task-manager-service --url

# Or port-forward to test locally
kubectl port-forward service/task-manager-service 30080:3000
```