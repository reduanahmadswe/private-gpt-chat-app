import { Server } from 'http'
import app from './app'
import { envVars } from './config/env'
import connectDB from './shared/database'

const PORT = envVars.PORT || 5001
let server: Server

// Start server for local development
const startServer = async () => {

    // Connect to database first
    console.log('🔌 Connecting to database...')
    await connectDB()
    console.log('✅ Database connected successfully')
    // Start the server
    server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`)
        console.log(`📝 Environment: ${envVars.NODE_ENV}`)
        console.log(`🌐 API Health Check: http://localhost:${PORT}/api/health`)
        console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`)
    })

    return server;
}

// Start the application
(async () => {
    await startServer();
})();
// Unhandled promise rejection
process.on('unhandledRejection', (error) => {
    console.log('Unhandled rejection detected .. server shutting down..', error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

// Uncaught exception
process.on('uncaughtException', (error) => {
    console.log('Uncaught exception detected... server shutting down..', error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

// Graceful shutdown (SIGTERM)
process.on('SIGTERM', (error) => {
    console.log('SIGTERM signal received... server shutting down..', error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

export default app