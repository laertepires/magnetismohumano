export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "seu_upload_preset"); // configure no painel da Cloudinary

  const res = await fetch("https://api.cloudinary.com/v1_1/seu_cloud_name/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Erro ao fazer upload para Cloudinary");
  }

  return data.secure_url;
}
