const express = require('express');
const router = express.Router();
const regTutor = require('./models/regTutor');
const Tutor = require('./models/Tutor');
const Tution = require('./models/Tution');
const Question = require('./models/Question');

// Define other routes
router.get('/', (req, res) => {
    res.send('Vitti360 Server running!');
});

router.post('/data', (req, res) => {
    console.log(req.body);
    res.send('Data received');
});


///// JIGGASA ROUTES  ///////
// GET
router.get('/jiggasa', async (req, res) => {
    try {
        const tags = ['bangla', 'english', 'science', 'history', 'religion', 'math', 'IQ', 'other'];
        const randomCategory = tags[Math.floor(Math.random() * tags.length)];
        const category = req.query.category || randomCategory;
        const questionId = req.query.id;

        let questions;
        if (questionId) {
            const question = await Question.findOne({ id: questionId });
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }
            questions = [question];
        } else {
            questions = await Question.find({ category }).sort({ id: 1 });
        }

        res.json({
            questions,
            category,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST
router.post('/jiggasa', async (req, res) => {
    try {
        const questions = await Question.find({}, { id: 1 }).sort({ id: -1 }).limit(1);
        let highestId = 1;

        if (questions.length > 0) {
            const highestIdPrev = questions[0].id;
            highestId = highestIdPrev + 1;
        }

        const newQuestion = new Question({
            id: highestId,
            questionText: req.body.questionText,
            category: req.body.category
        });

        await newQuestion.save();
        res.status(201).json({ message: 'Question added successfully', newQuestion });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// DELETE /jiggasa/:id
router.delete('/jiggasa/:id', async (req, res) => {
    try {
        const questionId = req.params.id;

        // Find the question by ID
        const question = await Question.findOne({ id: questionId });

        // Check if the question was found
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Delete the question
        await Question.deleteOne({ id: questionId });

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});


/////   TUTORS ROUTES
// GET
router.get('/tutors', async (req, res) => {
    try {
      const req_tag = req.query.tag || 'all';
      const searchQuery = req.query.query;
      const tags = ['buet', 'du', 'medical', 'cadet'];
      let data;
  
      if (searchQuery) {
        // If a search query is provided, search by query
        const searchRegex = new RegExp(searchQuery, 'i'); // Case-insensitive search
        data = await Tutor.find({
          $or: [
            { name: searchRegex },
            { pref: searchRegex },
            { institution: searchRegex },
            { dept: searchRegex },
            { college: searchRegex },
            { expertise: searchRegex }
          ]
        }).sort({ rating: -1, id: 1 });
      } else if (req_tag !== 'all') {
        // If a tag is provided, filter by tag
        data = await Tutor.find({ tag: req_tag }).sort({ rating: -1, id: 1 });
      } else {
        // Default case: get all tutors with specific tags
        data = await Tutor.find({ tag: { $in: tags } }).sort({ tag: 1, rating: -1, id: 1 });
      }
  
      res.status(200).json({
        message: 'Tutors retrieved successfully',
        data,
        currentTag: req_tag,
        searchQuery // Pass the search query in the response if it exists
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
/**
 * DELETE /tutors/:id
 * Delete a tutor by ID
 */
router.delete('/tutors/:id', async (req, res) => {
    try {
      const tutorId = req.params.id;
  
      // Find and delete the tutor by ID
      const result = await Tutor.findByIdAndDelete(tutorId);
  
      if (!result) {
        return res.status(404).json({ message: 'Tutor not found' });
      }
  
      res.status(200).json({ message: 'Tutor deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

/////   REGTUTOR ROUTES    ////
// POST
router.post('/reg-tutor', async (req, res) => {
    try {
        const newregTutor = new regTutor({
            name: req.body.name,
            tag: req.body.tag,
            institution: req.body.institution,
            dept: req.body.dept,
            hsc: req.body.hsc,
            background: req.body.background,
            college: req.body.college,
            expertise: req.body.expertise,
            mode: req.body.mode,
            pref: req.body.pref,
            phone: req.body.phone,
            email: req.body.email,
            fb: req.body.fb,
        });

        await regTutor.create(newregTutor);

        res.status(201).json({ message: 'Tutor registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET
router.get('/reg-tutor', async (req, res) => {
    try {
        const data = await regTutor.find().sort({ tag: 1 });
        res.json({
            title: 'Reg List',
            description: 'List of registered tutors',
            data
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

// GET APPROVE-REG TUTOR
router.get('/approve-reg/:id', async (req, res) => {
    try {
        const regtutor = await regTutor.findById(req.params.id);

        if (!regtutor) {
            return res.status(404).json({ message: 'Registration tutor not found' });
        }

        const tutors = await Tutor.find({}, { id: 1 }).sort({ id: -1 }).limit(1);
        let highestId = 1;

        if (tutors.length > 0) {
            const highestIdPrev = tutors[0].id;
            highestId = highestIdPrev + 1;
        }

        const newTutor = new Tutor({
            name: regtutor.name,
            id: highestId,
            tag: regtutor.tag,
            institution: regtutor.institution,
            dept: regtutor.dept,
            hsc: regtutor.hsc,
            background: regtutor.background,
            college: regtutor.college,
            expertise: regtutor.expertise,
            mode: regtutor.mode,
            pref: regtutor.pref,
            phone: regtutor.phone,
            email: regtutor.email,
            fb: regtutor.fb,
            rating: 5
        });

        await newTutor.save();
        await regtutor.deleteOne();
        res.json({ message: 'Tutor approved and registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});


//////  TUTION ROUTES  /////////

// POST /add-tution route
router.post('/tutions', async (req, res) => {
    try {
        const tutions = await Tution.find({}, { id: 1 }).sort({ id: -1 }).limit(1);
        let highestId = 1;

        if (tutions.length > 0) {
            highestId = tutions[0].id + 1;
        }

        // Create a new tution with the new ID
        const newTution = new Tution({
            id: highestId,
            tutorId: req.body.tutorId,
            studentName: req.body.studentName,
            class: req.body.class,
            college: req.body.college,
            phoneNumber: req.body.phoneNumber,
            guardianNumber: req.body.guardianNumber,
            startDate: req.body.startDate,
            description: req.body.description,
            remuneration: req.body.remuneration,
            location: req.body.location,
            mode: req.body.mode,
            medium: req.body.medium,
        });

        await newTution.save();
        res.status(201).json({ message: 'Tution added successfully', newTution });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// DELETE /tutions/:id route
router.delete('/tutions/:id', async (req, res) => {
    try {
        await Tution.deleteOne({ id: req.params.id });
        res.json({ message: 'Tution deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// GET /tutions route
router.get('/tutions', async (req, res) => {
    try {
        const tutions = await Tution.find().sort({ id: 1 });
        res.json({
            title: 'Tution List',
            description: 'List of all tutions',
            data: tutions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});


module.exports = router;
