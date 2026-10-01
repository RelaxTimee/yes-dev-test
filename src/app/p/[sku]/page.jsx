import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function PublicProductPage({ params }) {
  const { sku } = await params;
  
  const product = await prisma.product.findUnique({
    where: { sku: sku.toUpperCase() }
  });

  if (!product || product.status === 'inactive') {
    notFound();
  }

  try {
    await prisma.scanLog.create({
      data: { productId: product.id }
    });
  } catch(e) {}

  const images = product.images ? JSON.parse(product.images) : (product.imageUrl ? [product.imageUrl] : []);

  return (
    <div className="min-h-screen bg-[#F5EBD9] text-luma-text font-sans pb-24">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
        
        <div className="relative w-full aspect-square bg-gray-50 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          {images.length > 0 ? (
            images.map((imgUrl, idx) => (
              <img key={idx} src={imgUrl} alt={`${product.name} - ${idx+1}`} className="w-full h-full object-cover flex-shrink-0 snap-center" />
            ))
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-luma-dark/50 bg-luma-rose/20">
              <span className="text-4xl mb-2">✨</span>
              <span>ภาพสินค้ากำลังอัปเดต</span>
            </div>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
              {images.map((_, idx) => (
                <div key={idx} className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-sm backdrop-blur-sm"></div>
              ))}
            </div>
          )}
          
          <div className="absolute top-4 left-4 bg-luma-dark text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md z-10">
            {product.category || 'Luma Skincare'}
          </div>
        </div>

        <div className="p-7">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-4xl font-serif text-luma-text leading-tight">{product.name}</h1>
          </div>
          
          <div className="flex items-baseline gap-3 mb-6">
            <p className="text-3xl font-sans font-medium text-luma-dark">฿{product.price}</p>
            <p className="text-xs text-gray-400 tracking-wider">SKU: {product.sku}</p>
          </div>
          
          {product.size && (
            <div className="inline-block bg-luma-rose/30 border border-luma-dark/20 rounded-full px-5 py-1.5 text-sm font-medium text-luma-dark mb-6 tracking-wide">
              ปริมาณ: {product.size}
            </div>
          )}

          <hr className="my-8 border-luma-rose/50" />

          {product.description && (
            <div className="mb-8">
              <h3 className="text-xl font-serif text-luma-dark mb-4 tracking-wide">
                รายละเอียด
              </h3>
              <p className="text-luma-text/80 leading-relaxed whitespace-pre-line font-light">{product.description}</p>
            </div>
          )}

          {product.how_to_use && (
            <div className="mb-10">
              <h3 className="text-xl font-serif text-luma-dark mb-4 tracking-wide">
                วิธีใช้
              </h3>
              <div className="bg-luma-light/50 p-5 rounded-xl border border-luma-rose/50 text-luma-text/80 leading-relaxed whitespace-pre-line font-light">
                {product.how_to_use}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-md border-t border-luma-rose/30 px-5 py-4 flex gap-4 shadow-[0_-10px_40px_rgba(176,142,123,0.15)] pointer-events-auto">
            <button className="flex-1 bg-luma-dark text-white font-medium text-sm py-3.5 rounded-full hover:bg-[#967664] active:scale-95 transition-all shadow-md tracking-widest uppercase">
              สนใจสั่งซื้อ
            </button>
            <button className="w-14 flex-none bg-luma-rose/20 text-luma-dark rounded-full hover:bg-luma-rose/40 active:scale-95 transition-all flex justify-center items-center shadow-sm border border-luma-dark/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </button>
          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
