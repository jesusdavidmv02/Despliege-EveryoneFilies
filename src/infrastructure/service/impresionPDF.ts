import PDFDocument from "pdfkit";
import fs from "fs";

export function generateFlightTicket(
  ticketData: {
    passengerName: string;
    flightNumber: string ;
    seat: string;
    departureDate: string;
    departureTime: string;
    // boardingTime: string;
    departureAirport: string;
    arrivalAirport: string;
    duration: string;
    reservationCode: string;
    boardingGroup: string;
  },
  outputDirectory: string
) {

  // Ruta completa para guardar el archivo
  const filePath = `${outputDirectory}/${ticketData.passengerName}.pdf`;

  // Crear PDF
  const pdf = new PDFDocument({ size: "A4", margin: 50 });

  // Crear stream(archivo) del pdf
  const stream = fs.createWriteStream(filePath);
  pdf.pipe(stream);

  //Agregar una imagen
  pdf.image("./logo/logo_aerolinea.png", 50, 30, {width:100})

  //dibujar una barra azul en la parte superior
  pdf.rect(0, 0, pdf.page.width, 40).fill("#1E90FF")
  pdf.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(18).text("PASE DE ABORDAR", 0, 20, { align: "center" })

  //restablecer el color del texto a negro
  pdf.fillColor("#000000");
   // Espaciado inicial después del título y barra
   pdf.moveDown(3);

  // Estilos
  const boldFont = "Helvetica-Bold";
  const regularFont = "Helvetica";


  // Título
  //pdf
   // .font(boldFont)
    //.fontSize(20)
   // .text("PASE DE ABORDAR", { align: "center" })
    //.moveDown(1);

  // Código de reserva
  pdf
    .font(boldFont)
    .fontSize(12)
    .text(`CÓDIGO DE RESERVA: ${ticketData.reservationCode}`, {
      align: "right",
    });

  // Información del pasajero
  pdf
    .font(boldFont)
    .fontSize(16)
    .text(`Nombre del pasajero:`, 50, pdf.y)
    .font(regularFont)
    .fontSize(14)
    .text(ticketData.passengerName, { indent: 15 })
    .moveDown();

  // Detalles del vuelo
  pdf.font(boldFont).fontSize(16).text("Detalles del vuelo:").moveDown(0.5);

  pdf
    .font(regularFont)
    .fontSize(12)
    .text(`Número de vuelo: ${ticketData.flightNumber}`)
    .text(`Silla: ${ticketData.seat}`)
    .text(`Duración del vuelo: ${ticketData.duration}`)
    .text(`Salida: ${ticketData.departureDate} a las ${ticketData.departureTime}`)
    // .text(`Hora en sala: ${ticketData.boardingTime}`)
    .moveDown();

  // Aeropuertos
  pdf
    .font(boldFont)
    .fontSize(14)
    .text("Origen:")
    .font(regularFont)
    .text(ticketData.departureAirport)
    .moveDown(0.5);

  pdf
    .font(boldFont)
    .fontSize(14)
    .text("Destino:")
    .font(regularFont)
    .text(ticketData.arrivalAirport)
    .moveDown(1);

  // Pie de página 
  pdf
    .font(regularFont)
    .fontSize(15)
    .text("La puerta de la aeronave se cierra 15 minutos antes de la salida programada del vuelo.", 
      { align: 'center'}
    )
    .text("Debes estar en la sala de abordaje a más tardar 1 hora y 30 minutos antes.", {
      align: "center",
    });

    //barra azul en la parte inferior
    pdf.rect(0, pdf.page.height - 50, pdf.page.width, 50).fill("#1E90FF");

  // Finalizar el PDF y cerrar el flujo
  pdf.end();

  // Manejar evento de finalización
  stream.on("finish", () => {
    console.log(`PDF generado correctamente en: ${filePath}`);
  });

  stream.on("error", (err) => {
    console.error("Error al generar el PDF:", err);
  });
}

