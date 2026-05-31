#!/bin/bash

# ── Configuration ─────────────────────────────────────────────────────────────
VPS_USER="root"
VPS_IP="72.60.213.116"
DEST_DIR="/root/aegis-backend"

# Auto-accept host keys
SSH_OPTS="-o StrictHostKeyChecking=no"

echo "🚀 Starting deployment to $VPS_USER@$VPS_IP..."
echo "📂 Target directory: $DEST_DIR"

# ── 1. Créer le répertoire sur le VPS ─────────────────────────────────────────
echo ""
echo "📁 Creating remote directory..."
ssh $SSH_OPTS $VPS_USER@$VPS_IP "mkdir -p $DEST_DIR"

# ── 2. Copier les fichiers (le dossier agents) ────────────────────────────────
echo ""
echo "📦 Copying files..."
# On copie tout le contenu du dossier courant (agents)
rsync -avz --progress \
    -e "ssh $SSH_OPTS" \
    --exclude '__pycache__' \
    --exclude 'venv' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude '.DS_Store' \
    ./ $VPS_USER@$VPS_IP:$DEST_DIR/

# ── 4. Exécuter les commandes sur le VPS ──────────────────────────────────────
echo ""
echo "🔧 Configuring server and starting containers..."
ssh $SSH_OPTS $VPS_USER@$VPS_IP << EOF

cd $DEST_DIR

# ── Installer Docker si absent ────────────────────────────────────────────────
if ! command -v docker &> /dev/null; then
    echo "🐳 Docker not found. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker installed"
fi

# ── Vérifier que docker compose est disponible ────────────────────────────────
if ! docker compose version &> /dev/null; then
    echo "📦 Installing Docker Compose plugin..."
    apt-get update -qq
    apt-get install -y docker-compose-plugin
fi

echo ""
echo "🛑 Stopping existing Aegis containers (if any)..."
docker compose -f docker-compose.yml down --remove-orphans 2>/dev/null || true

echo ""
echo "🏗️  Building and starting containers (no cache)..."
docker compose -f docker-compose.yml build --no-cache aegis-api
docker compose -f docker-compose.yml up -d

echo ""
echo "📋 Running containers after deployment:"
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}" | grep aegis

echo ""
echo "✅ Deployment complete!"
echo "🌐 API available at: http://$VPS_IP:8080"
echo "📚 Swagger docs at:  http://$VPS_IP:8080/docs"
echo ""
echo "📝 Useful commands:"
echo "  docker logs aegis-api -f          # Follow API logs"
echo "  docker exec -it aegis-api sh      # Shell into API container"

EOF

echo ""
echo "🎉 Deployment script finished!"
