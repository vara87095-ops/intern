// Start server or connect to it
import './src/server.js';

const PORT = process.env.PORT || 5000;

async function runTests() {
  // Give server 500ms to initialize
  await new Promise((r) => setTimeout(r, 600));

  try {
    const baseUrl = `http://localhost:${PORT}/api`;

    // 1. Test Login with Demo Admin
    console.log('Test 1: Login with demo credentials...');
    let res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex@demo.com', password: 'password123' })
    });
    const loginData = await res.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    console.log('✅ Login successful! Token received.');
    const token = loginData.token;

    // 2. Test Get Current User (/auth/me)
    console.log('Test 2: Fetch current user profile with token...');
    res = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meData = await res.json();
    if (!meData.success || meData.user.email !== 'alex@demo.com') {
      throw new Error(`Auth me failed: ${JSON.stringify(meData)}`);
    }
    console.log(`✅ Current user verified: ${meData.user.name} (${meData.user.role})`);

    // 3. Test List Tasks
    console.log('Test 3: Fetch task list and verify seed tasks...');
    res = await fetch(`${baseUrl}/tasks`);
    const tasksData = await res.json();
    if (!tasksData.success || !Array.isArray(tasksData.data)) {
      throw new Error(`Tasks fetch failed: ${JSON.stringify(tasksData)}`);
    }
    console.log(`✅ Tasks fetched successfully (${tasksData.count} tasks found).`);

    // 4. Test Create Task
    console.log('Test 4: Create a new task with Auth token...');
    res = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Automated Test Task',
        description: 'Testing task creation flow with WebSockets and JWT',
        status: 'To Do',
        priority: 'High',
        dueDate: '2026-04-30',
        tags: ['AutomatedTest', 'QA']
      })
    });
    const createdTaskData = await res.json();
    if (!createdTaskData.success || !createdTaskData.data.id) {
      throw new Error(`Task creation failed: ${JSON.stringify(createdTaskData)}`);
    }
    const createdId = createdTaskData.data.id;
    console.log(`✅ Task created with ID: ${createdId}`);

    // 5. Test Update Task Status
    console.log('Test 5: Update task status to "In Progress"...');
    res = await fetch(`${baseUrl}/tasks/${createdId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'In Progress' })
    });
    const updateData = await res.json();
    if (!updateData.success || updateData.data.status !== 'In Progress') {
      throw new Error(`Status update failed: ${JSON.stringify(updateData)}`);
    }
    console.log(`✅ Task status updated: ${updateData.data.status}`);

    // 6. Test Delete Task
    console.log('Test 6: Delete the test task...');
    res = await fetch(`${baseUrl}/tasks/${createdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const deleteData = await res.json();
    if (!deleteData.success) {
      throw new Error(`Delete failed: ${JSON.stringify(deleteData)}`);
    }
    console.log('✅ Task deleted successfully.');

    // 7. Test Task Stats
    console.log('Test 7: Fetch task statistics...');
    res = await fetch(`${baseUrl}/tasks/stats`);
    const statsData = await res.json();
    if (!statsData.success || typeof statsData.data.totalTasks !== 'number') {
      throw new Error(`Stats failed: ${JSON.stringify(statsData)}`);
    }
    // 8. Test Single-Service Frontend Serving
    console.log('Test 8: Verify frontend distribution serving (GET /)...');
    res = await fetch(`http://localhost:${PORT}/`);
    const htmlText = await res.text();
    if (res.status !== 200 || !htmlText.includes('root')) {
      throw new Error(`Frontend serving test failed: Status ${res.status}`);
    }
    console.log('✅ Frontend HTML served correctly from client/dist.');

    console.log('\n🎉 ALL FULL-STACK INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runTests();
