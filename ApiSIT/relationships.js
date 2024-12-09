import { Attraction } from './models/attraction.model.js'
import { Contact } from './models/contact.model.js'
import { Image } from './models/image.model.js'
import { User } from './models/user.model.js'
import { Person } from './models/person.model.js'
import { RefreshToken } from './models/refresh_token.model.js'
import { PasswordResetToken } from './models/password_reset_token.model.js'
import { Accessibility } from './models/accessibility.model.js'
import { Transport } from './models/transport.model.js'
import DocumentFile from './models/document_file.model.js'
import { EducationalResource } from './models/educational_resource.model.js'
import { InfoLegalRegulatoria } from './models/info_legal_regulatoria.model.js'
import { ArchaeologicalSite } from './models/archaeological_site.model.js'
import { Notification } from './models/notification.model.js' // Asegúrate de importar el modelo Notification
import { BasicService } from './models/basic_service.model.js'
import { Weather } from './models/weather.model.js'
import { SecurityService } from './models/security_service.model.js'
import { Establishment } from './models/establishment.model.js'
import { Category } from './models/category.model.js'
import { Owner } from './models/owner.model.js'
import { TourEvent } from './models/tour_event.model.js'

// Definir asociaciones

User.hasMany(Notification, {
  foreignKey: 'user_id', // La clave foránea en la tabla Notification
  onDelete: 'CASCADE' // Eliminar notificaciones si se elimina el usuario
})

// Definir asociación de notificación a usuario
Notification.belongsTo(User, {
  foreignKey: 'user_id', // La clave foránea en la tabla Notification
  allowNull: false // Aseguramos que cada notificación tenga un usuario asociado
})

// atraccion
Attraction.hasMany(Contact, {
  foreignKey: 'entity_id',
  allowNull: false,
  onDelete: 'CASCADE',
  scope: { entity_type: 'attraction' }
})
// Attraction.hasMany(Image, {
//   foreignKey: 'entity_id',
//   allowNull: false,
//   onDelete: 'CASCADE',
//   scope: { entity_type: 'attraction' }
// })
Attraction.hasOne(Accessibility, {
  foreignKey: 'attraction_id',
  onDelete: 'CASCADE',
  scope: { entity_type: 'attraction' }
})
Contact.belongsTo(Attraction, {
  foreignKey: 'entity_id',
  allowNull: false,
  scope: { entity_type: 'attraction' }
})
// Image.belongsTo(Attraction, {
//   foreignKey: 'entity_id',
//   allowNull: false,
//   constraints: false,
//   scope: { entity_type: 'attraction' }
// })
Accessibility.belongsTo(Attraction, {
  foreignKey: 'attraction_id',
  scope: { entity_type: 'attraction' }
})

// usuario
User.hasOne(Person, {
  foreignKey: 'user_id',
  allowNull: false,
  onDelete: 'CASCADE'
})
User.hasMany(RefreshToken, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
})
User.hasMany(PasswordResetToken, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
})
Person.belongsTo(User, {
  foreignKey: 'user_id',
  allowNull: false
})
RefreshToken.belongsTo(User, {
  foreignKey: 'user_id'
})
PasswordResetToken.belongsTo(User, {
  foreignKey: 'user_id'
})

// transport

// Transport.hasMany(Image, {
//   foreignKey: 'entity_id',
//   allowNull: false,
//   onDelete: 'CASCADE',
//   scope: { entity_type: 'transport' }
// })

// Image.belongsTo(Transport, {
//   foreignKey: 'entity_id',
//   allowNull: false,
//   constraints: false,
//   scope: { entity_type: 'transport' }
// })

EducationalResource.hasMany(DocumentFile, {
  foreignKey: 'entity_id',
  onDelete: 'CASCADE'
})

DocumentFile.belongsTo(EducationalResource, {
  foreignKey: 'entity_id',
  onDelete: 'CASCADE'
})

InfoLegalRegulatoria.hasMany(DocumentFile, {
  foreignKey: 'entity_id',
  onDelete: 'CASCADE'
})

DocumentFile.belongsTo(InfoLegalRegulatoria, {
  foreignKey: 'entity_id',
  onDelete: 'CASCADE'
})

// ArchaeologicalSite.hasMany(Image, {
//   foreignKey: 'entity_id',
//   onDelete: 'CASCADE'
// })

// Image.belongsTo(ArchaeologicalSite, {
//   foreignKey: 'entity_id',
//   onDelete: 'CASCADE'
// })

//nuevas relaciones 
Owner.hasMany(Establishment, {
  foreignKey: 'ownerId',
  as: 'owner'
});
Establishment.belongsTo(Owner, {
  foreignKey: 'ownerId',
  as: 'owner'
});

Category.hasMany(Establishment, {
  foreignKey: 'categoryId',
  as: 'category',
});
Establishment.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// Establishment.hasMany(Image, {
//   foreignKey: 'entity_id',
//   allowNull: false,
//   onDelete: 'CASCADE',
//   scope: { entity_type: 'establishment' }
// })

// Image.belongsTo(Establishment, {
//   foreignKey: 'entity_id',
//   allowNull: false,
//   constraints: false,
//   scope: { entity_type: 'establishment' }
// })

// Polimorfismo en Image
Image.belongsTo(Establishment, {
  foreignKey: 'entity_id',
  constraints: false, // No fuerza la clave foránea
  scope: { entity_type: 'establishment' }, // Filtro para tipo de entidad
});

Image.belongsTo(Attraction, {
  foreignKey: 'entity_id',
  constraints: false,
  scope: { entity_type: 'attraction' },
});

Image.belongsTo(Transport, {
  foreignKey: 'entity_id',
  constraints: false,
  scope: { entity_type: 'transport' },
});

// Relación inversa
Establishment.hasMany(Image, {
  foreignKey: 'entity_id',
  constraints: false,
  scope: { entity_type: 'establishment' },
});

Attraction.hasMany(Image, {
  foreignKey: 'entity_id',
  constraints: false,
  scope: { entity_type: 'attraction' },
});

Transport.hasMany(Image, {
  foreignKey: 'entity_id',
  constraints: false,
  scope: { entity_type: 'transport' },
});
