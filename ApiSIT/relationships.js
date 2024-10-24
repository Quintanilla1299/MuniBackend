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

// Definir asociaciones

// atraccion
Attraction.hasMany(Contact, {
  foreignKey: 'entity_id',
  allowNull: false,
  onDelete: 'CASCADE',
  scope: { entity_type: 'attraction' }
})
Attraction.hasMany(Image, {
  foreignKey: 'entity_id',
  allowNull: false,
  onDelete: 'CASCADE',
  scope: { entity_type: 'attraction' }
})
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
Image.belongsTo(Attraction, {
  foreignKey: 'entity_id',
  allowNull: false,
  constraints: false,
  scope: { entity_type: 'attraction' }
})
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

Transport.hasMany(Image, {
  foreignKey: 'entity_id',
  allowNull: false,
  onDelete: 'CASCADE',
  scope: { entity_type: 'transport' }
})

Image.belongsTo(Transport, {
  foreignKey: 'entity_id',
  allowNull: false,
  constraints: false,
  scope: { entity_type: 'transport' }
})

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

ArchaeologicalSite.hasMany(Image, {
  foreignKey: 'entity_id',
  onDelete: 'CASCADE'
})

Image.belongsTo(ArchaeologicalSite, {
  foreignKey: 'entity_id',
  onDelete: 'CASCADE'
})
