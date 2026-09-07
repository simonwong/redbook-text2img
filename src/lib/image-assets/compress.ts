export async function compressContentImage(file: Blob): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("请选择图片文件");
  }
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
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
