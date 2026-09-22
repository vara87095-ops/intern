import { ProjectRepository } from '../models/Project.js';
import { getDBStatus } from '../config/db.js';

export async function getProjects(req, res) {
  try {
    const { search, category, status, sortBy, order } = req.query;
    const projects = await ProjectRepository.findAll({
      search,
      category,
      status,
      sortBy,
      order
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await ProjectRepository.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error in getProjectById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
}

export async function createProject(req, res) {
  try {
    const { title, description, category, techStack, repoUrl, liveUrl, status, featured } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Project title is required'
      });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Project description is required'
      });
    }

    // Format techStack if comma-separated string or array
    let tags = [];
    if (Array.isArray(techStack)) {
      tags = techStack.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof techStack === 'string') {
      tags = techStack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    if (tags.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one technology in techStack'
      });
    }

    const project = await ProjectRepository.create({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Full Stack',
      techStack: tags,
      repoUrl: (repoUrl || '').trim(),
      liveUrl: (liveUrl || '').trim(),
      status: status || 'In Progress',
      featured: Boolean(featured)
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
}

export async function updateProject(req, res) {
  try {
    const { title, description, category, techStack, repoUrl, liveUrl, status, featured } = req.body;

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title.trim();
    if (description !== undefined) updatePayload.description = description.trim();
    if (category !== undefined) updatePayload.category = category;
    if (repoUrl !== undefined) updatePayload.repoUrl = repoUrl.trim();
    if (liveUrl !== undefined) updatePayload.liveUrl = liveUrl.trim();
    if (status !== undefined) updatePayload.status = status;
    if (featured !== undefined) updatePayload.featured = Boolean(featured);

    if (techStack !== undefined) {
      let tags = [];
      if (Array.isArray(techStack)) {
        tags = techStack.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof techStack === 'string') {
        tags = techStack.split(',').map((t) => t.trim()).filter(Boolean);
      }
      updatePayload.techStack = tags;
    }

    const updated = await ProjectRepository.update(req.params.id, updatePayload);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
}

export async function deleteProject(req, res) {
  try {
    const success = await ProjectRepository.delete(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
}

export async function getStats(req, res) {
  try {
    const stats = await ProjectRepository.getStatistics();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compute stats',
      error: error.message
    });
  }
}

export async function getHealth(req, res) {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus
  });
}
