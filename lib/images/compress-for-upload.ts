const MAX_EDGE = 1280;
const JPEG_QUALITY = 0.72;
const SKIP_IF_SMALLER_THAN = 400_000;

function canvasToFile(canvas: HTMLCanvasElement, name: string): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Compression image impossible."));
          return;
        }
        resolve(
          new File([blob], name.replace(/\.[^.]+$/, "") + ".jpg", {
            type: "image/jpeg",
          }),
        );
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image illisible."));
    image.src = src;
  });
}

async function fileToBitmap(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file);
  } catch {
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await loadHtmlImage(objectUrl);
      return await createImageBitmap(image);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }
}

/** Réduit une photo téléphone (HEIC/JPEG 8–12 Mo → ~200–400 Ko). */
export async function compressImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }
  if (file.size <= SKIP_IF_SMALLER_THAN && file.type === "image/jpeg") {
    return file;
  }

  try {
    const bitmap = await fileToBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const compressed = await canvasToFile(canvas, file.name);
    return compressed.size > 0 && compressed.size < file.size
      ? compressed
      : file;
  } catch {
    return file;
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Lecture de l'image impossible."));
    };
    reader.onerror = () => reject(new Error("Lecture de l'image impossible."));
    reader.readAsDataURL(file);
  });
}
