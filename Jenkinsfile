pipeline {
    agent any

    environment {
        REGISTRY = "registry.digitalocean.com/dapperautobutique"
        KUBECONFIG_CREDENTIALS = 'kubeconfig-credential-id'
        DOCKERHUB_CREDENTIALS = 'do-registry-credential-id'
    }

    stages {
        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        docker.withRegistry("https://${env.REGISTRY}", "${DOCKERHUB_CREDENTIALS}") {
                            def backendImage = docker.build("${env.REGISTRY}/backend:latest")
                            backendImage.push()
                        }
                    }
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        docker.withRegistry("https://${env.REGISTRY}", "${DOCKERHUB_CREDENTIALS}") {
                            def frontendImage = docker.build("${env.REGISTRY}/frontend:latest")
                            frontendImage.push()
                        }
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS}", variable: 'KUBECONFIG')]) {
                    sh '''
                        export KUBECONFIG=$KUBECONFIG
                        kubectl apply -f k8s-manifiestos/postgres-deployment.yaml
                        kubectl apply -f k8s-manifiestos/backend-deployment.yaml
                        kubectl apply -f k8s-manifiestos/frontend-deployment.yaml
                    '''
                }
            }
        }
    }
}
