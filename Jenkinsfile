pipeline {
    agent any
    stages {
        stage('Performance Testing') {
            steps {
                echo 'Installing k6'
                sh 'brew install k6'
                echo 'Running K6 performance tests...'
                sh 'k6 run first-script.js'
            }
        }
    }
}