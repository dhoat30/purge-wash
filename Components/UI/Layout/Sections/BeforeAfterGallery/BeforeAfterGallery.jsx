import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import BeforeAfter from "@/Components/UI/BeforeAfterSlider/BeforeAfter";
import styles from "./BeforeAfterGallery.module.scss";

function getImageAlt(image, index, label) {
  return image?.alt || image?.title || `House washing ${label} ${index + 1}`;
}

export default function BeforeAfterGallery({ title, description, images }) {
  const galleryItems = Array.isArray(images)
    ? images.filter((item) => item?.before?.url || item?.after?.url)
    : [];

  if (galleryItems.length === 0) return null;

  return (
    <section className={styles.section} id="gallery">
      <Container maxWidth="lg">
        <div className={styles.headingWrapper}>
          {title ? (
            <Typography variant="h2" component="h2" className={styles.title}>
              {title}
            </Typography>
          ) : null}

          {description ? (
            <Typography
              variant="h6"
              component="div"
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : null}
        </div>

        <div className={styles.galleryGrid}>
          {galleryItems.map((item, index) => {
            const beforeImage = item.before || null;
            const afterImage = item.after || null;
            const displayImage = afterImage || beforeImage;
            const hasComparison = Boolean(beforeImage?.url && afterImage?.url);

            return (
              <figure
                className={`${styles.galleryItem} ${
                  hasComparison ? styles.comparisonItem : ""
                }`}
                key={displayImage.id || displayImage.url || index}
              >
                {hasComparison ? (
                  <>
                    <BeforeAfter
                      data={{ beforeImage, afterImage }}
                      showTitle={false}
                    />
                    <figcaption className={styles.comparisonLabel}>
                      Drag to compare
                    </figcaption>
                  </>
                ) : (
                  <Image
                    src={displayImage.url}
                    alt={getImageAlt(displayImage, index, "result")}
                    width={displayImage.width || 900}
                    height={displayImage.height || 675}
                    sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                    className={styles.galleryImage}
                  />
                )}
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
