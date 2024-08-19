// server.js (o un archivo de prueba separado)
import { Attraction } from '../models/attraction.model.js'
import { Contact } from '../models/contact.model.js'
import { Image } from '../models/image.model.js'

async function testAssociations () {
  try {
    // Crear una atracción
    const attraction = await Attraction.create({
      name: 'Parque Nacional',
      description: 'Un hermoso parque nacional.',
      type_attraction: 'natural',
      location: 'Costa Rica'
    })

    // Crear contactos para la atracción
    await Contact.create({
      entity_id: attraction.attraction_id,
      entity_type: 'attraction',
      contact_type: 'phone',
      contact_value: '123-456-7890'
    })

    await Contact.create({
      entity_id: attraction.attraction_id,
      entity_type: 'attraction',
      contact_type: 'email',
      contact_value: 'info@parquenacional.cr'
    })

    // Crear una imagen para la atracción
    await Image.create({
      entity_id: attraction.attraction_id,
      entity_type: 'attraction',
      image_url: 'http://example.com/image.jpg'
    })

    console.log('Datos de prueba creados.')

    // Consultar la atracción y sus contactos e imágenes
    const result = await Attraction.findOne({
      where: { attraction_id: attraction.attraction_id },
      include: [Contact, Image]
    })

    console.log('Resultado:', JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('Error al probar asociaciones:', error)
  }
}

// Ejecutar la función de prueba
testAssociations()
