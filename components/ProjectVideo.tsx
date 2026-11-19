// Video de 10 s de un proyecto: en silencio, en bucle y en línea (sirve en celular). La captura es la portada mientras carga
// y también lo que se ve si el navegador no reproduce video. Mientras tanto, el marco muestra un brillo suave (ver .pj__shot en depth.css).
export default function ProjectVideo({ img, alt, className = 'pj__video' }: { img: string; alt: string; className?: string }) {
  return <video className={className} src={img.replace(/\.jpg$/, '.mp4')} poster={img} muted loop playsInline autoPlay preload="metadata" aria-label={alt} />;
}
