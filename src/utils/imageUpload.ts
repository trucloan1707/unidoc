export interface ProcessImageOptions {
  maxCount?: number;
  currentCount?: number;
  maxDimension?: number;
  maxFileSizeMB?: number;
}

export interface ProcessImageResult {
  dataUrls: string[];
  error: string | null;
}

function readAndOptimizeImage(file: File, maxDimension: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        reject(new Error('Không thể đọc tệp hình ảnh.'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        const largestSide = Math.max(img.width, img.height);
        if (largestSide <= maxDimension && file.size <= 600 * 1024) {
          resolve(result);
          return;
        }

        const scale = largestSide > maxDimension ? maxDimension / largestSide : 1;
        const targetWidth = Math.max(1, Math.round(img.width * scale));
        const targetHeight = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        try {
          const optimized = canvas.toDataURL('image/jpeg', 0.86);
          resolve(optimized);
        } catch {
          resolve(result);
        }
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => reject(new Error('Không thể đọc tệp hình ảnh.'));
    reader.readAsDataURL(file);
  });
}

export async function processImageFiles(
  fileList: FileList | File[],
  options: ProcessImageOptions = {}
): Promise<ProcessImageResult> {
  const {
    maxCount = 6,
    currentCount = 0,
    maxDimension = 1200,
    maxFileSizeMB = 10,
  } = options;

  const files = Array.from(fileList);
  if (files.length === 0) {
    return { dataUrls: [], error: null };
  }

  const remainingSlots = Math.max(0, maxCount - currentCount);
  if (remainingSlots === 0) {
    return {
      dataUrls: [],
      error: `Bạn chỉ có thể tải lên tối đa ${maxCount} ảnh.`,
    };
  }

  const errors: string[] = [];
  const validFiles: File[] = [];

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      errors.push(`"${file.name}" không phải tệp hình ảnh hợp lệ (JPG, PNG, WEBP...).`);
      continue;
    }
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      errors.push(`"${file.name}" vượt quá dung lượng tối đa ${maxFileSizeMB}MB.`);
      continue;
    }
    validFiles.push(file);
  }

  const filesToProcess = validFiles.slice(0, remainingSlots);
  if (validFiles.length > remainingSlots) {
    errors.push(`Chỉ giữ lại ${remainingSlots} ảnh đầu tiên (tối đa ${maxCount} ảnh).`);
  }

  const settled = await Promise.allSettled(
    filesToProcess.map((f) => readAndOptimizeImage(f, maxDimension))
  );

  const dataUrls: string[] = [];
  for (const res of settled) {
    if (res.status === 'fulfilled' && res.value) {
      dataUrls.push(res.value);
    } else {
      errors.push('Có ảnh không đọc được, vui lòng thử lại với ảnh khác.');
    }
  }

  return {
    dataUrls,
    error: errors.length > 0 ? errors[0] : null,
  };
}
