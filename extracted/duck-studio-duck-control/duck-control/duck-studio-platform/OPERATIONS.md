# Duck Studio — Activación operativa

## Estado de esta versión

La plataforma incluye el portafolio público, el explorador de beats, la captación de leads con consentimiento, el portal autenticado, Beat Lab guiado y el centro de control con tres nodos de decisión. Las tablas de proyectos, briefs, consentimiento y eventos de auditoría ya están aplicadas.

## Shopify

La activación automática del storefront fue bloqueada por permisos de la aplicación de Shopify: la aplicación debe operar como canal o contar con los permisos de acceso no autenticado necesarios para crear el token de storefront. Hasta resolverlo, la interfaz muestra el catálogo de referencia y deja explícito que el carrito y checkout no están activos.

Cuando la integración esté disponible, se deben asociar los productos y sus variantes de licencia a Shopify, conectar los previews de audio autorizados y reemplazar el estado pendiente del checkout por el carrito real. No se debe publicar precios, licencias ni archivos de audio definitivos hasta que Duck los confirme.

## Contenido pendiente

Los trabajos destacados, testimonios y recursos descargables están deliberadamente vacíos. El sitio no inventa reseñas, créditos, opiniones de clientes, archivos de producción ni derechos de uso. Para activarlos, Duck debe proporcionar los materiales autorizados, sus licencias y, en el caso de testimonios, consentimiento verificable de cada persona.

## Operación comercial y privacidad

El formulario captura el consentimiento de seguimiento y una región de privacidad declarada. El control del propietario permite detener acciones externas y pedir aprobación manual. Toda acción propuesta se evalúa mediante tres nodos: validez de datos y reglas, riesgo operativo y autorización del propietario. Esta implementación ofrece controles operativos y trazabilidad; la configuración definitiva debe revisarse conforme a la legislación que resulte aplicable y no constituye asesoramiento legal.

## Verificación realizada

Se ejecutaron las comprobaciones de TypeScript y las pruebas automatizadas. También se revisaron la portada, el catálogo y el portal en escritorio y en móvil. La interfaz respeta la preferencia de reducción de movimiento y dispone de estados vacíos para proyectos, briefs, recursos y eventos de auditoría.
