# Use Node.js LTS version
FROM node:${NODE_VERSION:-18}-slim

# Install Chrome dependencies and Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libxtst6 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome path
ENV CHROME_PATH=/usr/bin/google-chrome

# Create app directory
WORKDIR ${APP_DIR:-/usr/src/app}

# Create a non-root user
RUN groupadd -r ${APP_GROUP:-lighthouse} && useradd -r -g ${APP_GROUP:-lighthouse} ${APP_USER:-lighthouse}

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY backend/ .

# Set proper permissions
RUN chown -R ${APP_USER:-lighthouse}:${APP_GROUP:-lighthouse} ${APP_DIR:-/usr/src/app}

# Switch to non-root user
USER ${APP_USER:-lighthouse}

# Expose port (will be overridden by environment variable)
EXPOSE ${PORT:-3000}

# Start the application
CMD ["npm", "start"] 