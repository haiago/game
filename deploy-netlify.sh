#!/bin/bash
set -e

TOKEN="${NETLIFY_AUTH_TOKEN:-nfp_SRcpYHHsqRz96KMwNAjFWa7Argzg5EdXec63}"
SITE_ID="4382d9a4-0af2-4b04-8ef6-90eb3d493f51"

echo "🚀 Đang build bản production..."
npm run build

echo "📦 Đang nén bundle dist..."
cd dist
zip -q -r ../deploy.zip .
cd ..

echo "🌐 Đang tải lên Netlify..."
curl -s -f -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/zip" \
     --data-binary "@deploy.zip" \
     "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys" > /dev/null

rm -f deploy.zip
echo "✅ Đã deploy thành công lên Netlify!"
echo "👉 Truy cập: https://polite-caramel-df5cff.netlify.app"
