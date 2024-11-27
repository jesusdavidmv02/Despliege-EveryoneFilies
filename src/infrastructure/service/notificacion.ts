import nodemailer from 'nodemailer';
import { Pasajero } from '../../domain/models/pasajero.interface';

// Configura el transportador (transport) con los datos de tu servicio SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar 'hotmail', 'yahoo', etc.
  auth: {
    user: 'everyonefliesaerolinea@gmail.com',
    pass: 'tioe gucd irui ajnv'
  }
});

// Función para enviar el correo
export async function enviarCorreo(email :string | undefined , pasajero: any , attachmentPath : string) {
  try {
    const info = await transporter.sendMail({
      from: 'everyonefliesaerolinea@gmail.com', // Dirección y nombre del remitente
      to: email, // Destinatario
      subject: 'Pase de Abordar',
      text: 'Aquí está su pase de abordar. ¡Buen vuelo!',
      attachments: [
        {
          filename: "tickets-" + pasajero.nombre +".pdf"  ,
           path: attachmentPath, // Ruta del archivo PDF generado
        },
      ],
      html: '<b>Hola :  </b> ' + pasajero.nombre + " " + pasajero.apellido 
      + ' <b> Te hacemos el envio de parte de nuestra entidad gracias  </b>'  // Puedes usar HTML para dar formato
    });

    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}

// enviarCorreo();
