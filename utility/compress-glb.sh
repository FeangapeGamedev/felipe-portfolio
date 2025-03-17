#!/bin/bash
# Install gltf-pipeline globally if you haven't already
npm install -g gltf-pipeline

# Compress all .glb files in the 3D models directory
for file in ./src/assets/3dModels/*.glb; do
  if [ -f "$file" ]; then
    output="${file%.glb}-draco.glb"
    echo "Compressing $file..."
    gltf-pipeline -i "$file" -o "$output" -d
  fi
done
echo "✅ Draco compression complete!"
