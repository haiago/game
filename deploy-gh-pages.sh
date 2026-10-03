#!/bin/bash
set -e

echo "🚀 1. Đang build bản production mới nhất..."
npm run build
touch dist/.nojekyll

echo "📦 2. Đang đóng gói thư mục dist vào nhánh gh-pages..."
TMP_INDEX="/tmp/git_dist_index_$$"
rm -f "$TMP_INDEX"
GIT_INDEX_FILE="$TMP_INDEX" git --work-tree=dist add -A
TREE_ID=$(GIT_INDEX_FILE="$TMP_INDEX" git write-tree)
rm -f "$TMP_INDEX"

PARENT_COMMIT=$(git rev-parse --verify origin/gh-pages 2>/dev/null || git rev-parse --verify gh-pages 2>/dev/null || echo "")
if [ -n "$PARENT_COMMIT" ]; then
  COMMIT_ID=$(git commit-tree $TREE_ID -p $PARENT_COMMIT -m "deploy: thêm 2 thú cưng mới Bé Rùa Thần và Thỏ Ngọc Bông Gòn")
else
  COMMIT_ID=$(git commit-tree $TREE_ID -m "deploy: thêm 2 thú cưng mới Bé Rùa Thần và Thỏ Ngọc Bông Gòn")
fi

echo "🌐 3. Đang đẩy lên GitHub Pages (nhánh gh-pages)..."
git push origin $COMMIT_ID:refs/heads/gh-pages

# Cập nhật ref local gh-pages nếu có
git update-ref refs/heads/gh-pages $COMMIT_ID 2>/dev/null || true

echo "✅ Hoàn tất deploy lên GitHub Pages!"
echo "👉 Truy cập tại: https://haiago.github.io/game/"
