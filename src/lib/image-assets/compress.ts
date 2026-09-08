export async function compressContentImage(file: Blob): Promise<Blob> {
  if (file.type && !file.type.startsWith("image/")) {
    throw new Error("请选择图片文件");
  }
  const url = URL.createObjectURL(file);
  let width: number;
  let height: number;
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("图片解码失败，请换一张图片重试"));
      image.src = url;
    });
    const scale = Math.min(
      1,
      2000 / Math.max(image.naturalWidth, image.naturalHeight)
    );
    width = Math.max(1, Math.round(image.naturalWidth * scale));
    height = Math.max(1, Math.round(image.naturalHeight * scale));
  } finally {
    URL.revokeObjectURL(url);
  }
  // Read natural dimensions with an img so no full-size bitmap is allocated before resized decoding.
  const bitmap = await createImageBitmap(file, {
    resizeHeight: height,
    resizeQuality: "high",
    resizeWidth: width,
  });
  try {
    const canvas = document.createElement("canvas");
    // Browsers that ignore resize options return a full-size bitmap; the canvas keeps the capped size either way.
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("无法处理图片");
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = false;
    for (let offset = 3; offset < data.length; offset += 4) {
      if (data[offset] < 255) {
        transparent = true;
        break;
      }
    }
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("无法压缩图片"));
          }
        },
        transparent ? "image/png" : "image/jpeg",
        0.85
      );
    });
  } finally {
    bitmap.close();
  }
}
