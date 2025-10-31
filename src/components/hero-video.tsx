"use client"

interface HeroVideoProps {
  src: string
  className?: string
}

export default function HeroVideo({ src, className = "" }: HeroVideoProps) {
  return (
    <video 
      autoPlay 
      loop 
      muted 
      playsInline
      preload="metadata"
      className={`absolute inset-0 w-full h-full object-cover opacity-50 ${className}`}
      onError={(e) => {
        console.error('Erro no vídeo:', e);
        // Ocultar vídeo se der erro
        const video = e.currentTarget;
        video.style.display = 'none';
      }}
      onLoadStart={() => console.log('Vídeo iniciando carregamento')}
      onCanPlay={() => console.log('Vídeo pronto para reproduzir')}
      onLoadedData={() => console.log('Vídeo carregado com sucesso')}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}