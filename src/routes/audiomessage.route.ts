import { Router } from "express";
import * as AudioMessage from "@/controllers/audiomessage.controller"
import { upload } from "@/utils/s3service";
const router = Router();


/**
 * @route POST /audio/audiomessage
 * @description upload Muisc, banner and other details
 * @access Public
 */
router.post("/audiomessageupload", upload.fields([ { name: 'Banner', maxCount: 1 }]), AudioMessage.uploade);//upload



  /**
 * Update audio details by ID.
 * @route PUT /api/audio/:id
 * @description Update details of a specific audio by ID.
 * @access Public
 * @param {string} req.params.id - The ID of the audio to update.
 * @param {object} req.body - The updated details including title, artist, description, and lyrics.
 * @returns {object} - Success message if details are updated successfully.
 * @throws {object} - Returns a 404 error if the audio is not found. Returns a 400 error if details are not updated.
 */
// router.put('/updateAudio/:id', Music.updateAudioDetails);//update


/**
 * Get all audio details.
 * @route GET /api/audiomessage
 * @description Retrieve details of all folders entries.
 * @access Public
 * @returns {Array} - List of all folders details.
 * @throws {object} - Returns a 500 error if there is an error retrieving folders details.
 */
router.get('/getall', AudioMessage.allfolders);//getall


/**
 * @route DELETE /delete/:id
 * @description delete music document using ID
 * @access Public
 */
// router.delete('/delete/:id', Music.deletesongByID);//deleteById

/**
 * @route GET /getbyId/:id
 * @description get music document using ID
 * @access Public
 */
// router.get('/getbyId/:id', Music.getAudioById);//getById

/**
 * Get audio details by name or word in the title.
 * @route GET /api/audio/byName/:name
 * @description Retrieve audio details by name or word in the title.
 * @access Public
 * @param {string} req.params.name - The name or word to search for in the audio titles.
 * @returns {object} - Object containing audio details matching the specified name and word.
 * @throws {object} - Returns a 500 error if there is an error retrieving audio details.
 */
router.get('/:name', AudioMessage.getFolderByName);//getByFolderName


export default router;