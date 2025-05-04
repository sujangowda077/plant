export default function ImagePreview({ imageUrl }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg mb-6 max-h-[500px] border border-gray-200">
      <img 
        src={imageUrl} 
        alt="Plant preview" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
