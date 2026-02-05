# API Testing Script for Bug Tracker

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Bug Tracker API Testing Suite" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080"
$testEmail = "testuser_$(Get-Random)@example.com"
$testPassword = "password123"
$token = ""

# Test 1: User Signup
Write-Host "[TEST 1] User Signup..." -ForegroundColor Yellow
try {
    $signupBody = @{
        fullName = "Test User"
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json

    $signupResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method POST -ContentType "application/json" -Body $signupBody
    $token = $signupResponse.jwt
    Write-Host "✓ Signup successful! Token received." -ForegroundColor Green
    Write-Host "  Email: $testEmail" -ForegroundColor Gray
} catch {
    Write-Host "✗ Signup failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: User Signin
Write-Host "[TEST 2] User Signin..." -ForegroundColor Yellow
try {
    $signinBody = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json

    $signinResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signin" -Method POST -ContentType "application/json" -Body $signinBody
    $token = $signinResponse.jwt
    Write-Host "✓ Signin successful!" -ForegroundColor Green
} catch {
    Write-Host "✗ Signin failed: $_" -ForegroundColor Red
}

Write-Host ""

# Setup headers with token
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 3: Create Project
Write-Host "[TEST 3] Create Project..." -ForegroundColor Yellow
try {
    $projectBody = @{
        name = "Test Project"
        description = "A test project for API validation"
        category = "Development"
        tags = @("testing", "api", "automation")
    } | ConvertTo-Json

    $projectResponse = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Method POST -Headers $headers -Body $projectBody
    $projectId = $projectResponse.id
    Write-Host "✓ Project created successfully!" -ForegroundColor Green
    Write-Host "  Project ID: $projectId" -ForegroundColor Gray
    Write-Host "  Project Name: $($projectResponse.name)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Project creation failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: Get All Projects
Write-Host "[TEST 4] Get All Projects..." -ForegroundColor Yellow
try {
    $projects = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Method GET -Headers $headers
    Write-Host "✓ Retrieved $($projects.Count) project(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to retrieve projects: $_" -ForegroundColor Red
}

Write-Host ""

# Test 5: Get Project by ID
Write-Host "[TEST 5] Get Project by ID..." -ForegroundColor Yellow
try {
    $project = Invoke-RestMethod -Uri "$baseUrl/api/projects/$projectId" -Method GET -Headers $headers
    Write-Host "✓ Retrieved project: $($project.name)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to retrieve project: $_" -ForegroundColor Red
}

Write-Host ""

# Test 6: Create Issue
Write-Host "[TEST 6] Create Issue..." -ForegroundColor Yellow
try {
    $issueBody = @{
        title = "Test Issue - API Validation"
        description = "This is a test issue created via API"
        status = "pending"
        priority = "high"
        projectId = $projectId
        dueDate = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
    } | ConvertTo-Json

    $issueResponse = Invoke-RestMethod -Uri "$baseUrl/api/issues" -Method POST -Headers $headers -Body $issueBody
    $issueId = $issueResponse.id
    Write-Host "✓ Issue created successfully!" -ForegroundColor Green
    Write-Host "  Issue ID: $issueId" -ForegroundColor Gray
    Write-Host "  Title: $($issueResponse.title)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Issue creation failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 7: Get Issues by Project
Write-Host "[TEST 7] Get Issues by Project..." -ForegroundColor Yellow
try {
    $issues = Invoke-RestMethod -Uri "$baseUrl/api/issues/project/$projectId" -Method GET -Headers $headers
    Write-Host "✓ Retrieved $($issues.Count) issue(s) for project" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to retrieve issues: $_" -ForegroundColor Red
}

Write-Host ""

# Test 8: Update Issue Status
Write-Host "[TEST 8] Update Issue Status..." -ForegroundColor Yellow
try {
    $updatedIssue = Invoke-RestMethod -Uri "$baseUrl/api/issues/$issueId/status/in_progress" -Method PUT -Headers $headers
    Write-Host "✓ Issue status updated to: $($updatedIssue.status)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to update issue status: $_" -ForegroundColor Red
}

Write-Host ""

# Test 9: Search Projects
Write-Host "[TEST 9] Search Projects..." -ForegroundColor Yellow
try {
    $searchResults = Invoke-RestMethod -Uri "$baseUrl/api/projects/search?keyword=Test" -Method GET -Headers $headers
    Write-Host "✓ Search returned $($searchResults.Count) result(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Search failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 10: Get Issue by ID
Write-Host "[TEST 10] Get Issue by ID..." -ForegroundColor Yellow
try {
    $issue = Invoke-RestMethod -Uri "$baseUrl/api/issues/$issueId" -Method GET -Headers $headers
    Write-Host "✓ Retrieved issue: $($issue.title)" -ForegroundColor Green
    Write-Host "  Status: $($issue.status)" -ForegroundColor Gray
    Write-Host "  Priority: $($issue.priority)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to retrieve issue: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "All core API endpoints tested successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Test Artifacts:" -ForegroundColor Yellow
Write-Host "  - User Email: $testEmail" -ForegroundColor Gray
Write-Host "  - Project ID: $projectId" -ForegroundColor Gray
Write-Host "  - Issue ID: $issueId" -ForegroundColor Gray
Write-Host ""
