const express = require("express");
const { z, ZodError } = require("zod");
const { nanoid } = require("nanoid");
const { createUrl, findByCode } = require("../repo/urlRepo");

const router = express.Router();

const bodySchema = z.object({
    url: z.string().url("Invalid URL format")
});

// POST /shorten -> { shortUrl }
router.post("/shorten", async (req, res) => {
    try {
        const { url } = bodySchema.parse(req.body);
        const code = nanoid(6);
        await createUrl(code, url);
    const base = process.env.PUBLIC_BASE_URL || process.env.PUBLIC_BASIC_URL || `http://localhost:${process.env.PORT || 3000}`;
        res.json({ shortUrl: `${base}/${code}`, code });
    } catch (e) {
        if (e instanceof ZodError) return res.status(400).json({ error: e.issues.map(issue => issue.message).join(", ") });
        if (e.code === "SQLITE_CONSTRAINT") return res.status(409).json({ error: "Code already exists." });
        res.status(500).json({ error: "Server error" });
    }
});

// GET /:code -> 302 redirect
router.get("/:code", async (req, res) => {
    try {
        const { code } = req.params;
        const row = await findByCode(code);
        if (!row) return res.status(404).send("Not Found");
        res.redirect(row.url);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;