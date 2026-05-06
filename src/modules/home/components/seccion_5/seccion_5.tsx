import { useEffect, useState } from "react";
import style from "./seccion_5.module.css";
import { supabase } from "../../../../app/services/apiSupabase";
import { getField } from "../../../../shared/utils/catalogImage";

type TestimonioRow = Record<string, unknown>;

type VideoItem = {
  id: number;
  titulo: string;
  link: string;
};

function estaActivo(valor: boolean | null | undefined) {
  return valor === true;
}

async function fetchAllRows(tableName: string) {
  const pageSize = 1000;
  const allRows: Record<string, unknown>[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .range(from, from + pageSize - 1);

    if (error) {
      throw error;
    }

    const rows = (data ?? []) as Record<string, unknown>[];
    allRows.push(...rows);

    if (rows.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return allRows;
}

const Seccion_5 = () => {
  const [videoActivo, setVideoActivo] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarTestimonios = async () => {
      let data: TestimonioRow[];

      try {
        data = await fetchAllRows("testimonio");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        console.error("No se pudieron cargar los testimonios:", message);
        setVideos([]);
        setCargando(false);
        return;
      }

      const testimoniosMapeados = data
        .filter((item) => estaActivo(getField<boolean>(item, "testMostrar", "testmostrar")))
        .map((item) => {
          const id = getField<number>(item, "testId", "testid", "id");
          const link = getField<string>(item, "testLink", "testlink", "link")?.trim() ?? "";

          if (id === null || id === undefined || !link) {
            return null;
          }

          return {
            id: Number(id),
            titulo: `Testimonio ${id}`,
            link,
          };
        })
        .filter((item): item is VideoItem => Boolean(item))
        .sort((a, b) => a.id - b.id);

      setVideos(testimoniosMapeados);
      setCargando(false);
    };

    cargarTestimonios();
  }, []);

  if (cargando) {
    return null;
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className={style.seccion}>
      <h2 className={style.titulo}>Testimonios</h2>

      <div className={style.contenedor}>
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            className={style.card}
            onClick={() => setVideoActivo(video.link)}
            aria-label={`Abrir ${video.titulo}`}
          >
            <div className={style.thumbWrap}>
              <div className={style.glow} />
              <video
                src={video.link}
                className={style.thumb}
                preload="metadata"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className={style.overlay} />
              <div className={style.info}>
                <span className={style.badge}>Cliente real</span>
                <strong className={style.cardTitle}>{video.titulo}</strong>
                <span className={style.cardText}>Reproduce la experiencia completa</span>
              </div>
              <span className={style.play}>
                <span className={style.playTriangle}>&#9654;</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      {videoActivo && (
        <div className={style.modalOverlay} onClick={() => setVideoActivo(null)}>
          <div className={style.modal} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={style.cerrar}
              onClick={() => setVideoActivo(null)}
              aria-label="Cerrar video"
            >
              &times;
            </button>

            <div className={style.videoWrap}>
              <video
                src={videoActivo}
                className={style.videoPlayer}
                controls
                autoPlay
                playsInline
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Seccion_5;
