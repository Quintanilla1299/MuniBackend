import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Función para crear el almacenamiento de Multer
const createMulterStorage = (entityType) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join('images', entityType)
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
      }
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
}

const multimediaFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/x-msvideo', // AVI
    'audio/mpeg', // MP3
    'audio/wav', // WAV
    'application/pdf', // PDF
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-excel', // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'application/vnd.ms-powerpoint', // PPT
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' // PPTX
  ]
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, MP4, AVI, MP3, WAV, PDF, DOC, DOCX, XLS, XLSX, PPT, and PPTX are allowed.'), false)
  }
}

const uploadFiles = (entityType) => {
  const storage = createMulterStorage(entityType)
  return multer({ storage, fileFilter: multimediaFilter })
}

export const checkEntityExists = (model) => {
  return async (req, res, next) => {
    const { id } = req.params
    try {
      const entity = await model.findByPk(id)
      if (!entity) {
        return res.status(404).json({ message: 'Entity not found' })
      }
      next()
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default uploadFiles
