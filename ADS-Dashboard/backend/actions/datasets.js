const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

const uploadsDir = path.join(__dirname, '..', '..', 'data', 'uploads');

// Ensure uploads directory exists
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const id = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${id}${ext}`);
    }
});

const upload = multer({ 
    storage,
    // limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

const uploadDataset = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const { connectorId } = req.params;
        const { filename, originalname, size, mimetype } = req.file;
        const { title, description } = req.body;
        const now = new Date().toISOString();
        const dataset = {
            id: path.parse(filename).name,
            connectorId,
            name: title || originalname,
            filename,
            size,
            mimetype,
            description: description || null,
            createdAt: now,
            updatedAt: now
        };
        await db.insert('datasets', dataset);
        res.json(dataset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDatasets = async (req, res) => {
    try {
        const { connectorId } = req.params;
        const datasets = await db.select('datasets', '*', { connectorId });
        res.json(datasets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDataset = async (req, res) => {
    try {
        const { connectorId, id } = req.params;
        const dataset = await db.selectOne('datasets', '*', { id, connectorId });
        
        if (!dataset) {
            return res.status(404).json({ error: 'Dataset not found' });
        }
        
        const filePath = path.join(uploadsDir, dataset.filename);
        res.download(filePath, dataset.name);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteDataset = async (req, res) => {
    try {
        const { connectorId, id } = req.params;
        const dataset = await db.selectOne('datasets', '*', { id, connectorId });
        
        if (!dataset) {
            return res.status(404).json({ error: 'Dataset not found' });
        }
        
        await fs.unlink(path.join(uploadsDir, dataset.filename));
        await db.run('DELETE FROM datasets WHERE id = ? AND connectorId = ?', [id, connectorId]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDataset = async (req, res) => {
    try {
        const { connectorId, id } = req.params;
        const { title, description } = req.body;
        
        const dataset = await db.selectOne('datasets', '*', { id, connectorId });
        if (!dataset) {
            return res.status(404).json({ error: 'Dataset not found' });
        }
        
        const updatedData = {
            name: title || dataset.name,
            description: description !== undefined ? description : dataset.description,
            updatedAt: new Date().toISOString()
        };
        
        await db.run('UPDATE datasets SET name = ?, description = ?, updatedAt = ? WHERE id = ? AND connectorId = ?', 
            [updatedData.name, updatedData.description, updatedData.updatedAt, id, connectorId]);
        
        const updated = await db.selectOne('datasets', '*', { id, connectorId });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    upload: upload.single('file'),
    uploadDataset,
    getDatasets,
    getDataset,
    updateDataset,
    deleteDataset
};