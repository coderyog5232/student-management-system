let students = JSON.parse(localStorage.getItem("students")) || [];

let editIndex = -1;

// Open Form

function openForm() {
    document.getElementById("studentModal").style.display = "flex";
}

// Close Form

function closeForm() {
    document.getElementById("studentModal").style.display = "none";

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("course").value = "";
    document.getElementById("status").value = "Active";

    editIndex = -1;
}

// Save Student

function saveStudent() {

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let course = document.getElementById("course").value.trim();
    let status = document.getElementById("status").value;

    if (!name || !email || !course) {
        alert("Please fill all fields!");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address!");
        return;
    }

    let student = {
        id: editIndex === -1
            ? Date.now()
            : students[editIndex].id,
        name,
        email,
        course,
        status
    };

    if (editIndex === -1) {
        students.push(student);
    } else {
        students[editIndex] = student;
    }

    localStorage.setItem("students", JSON.stringify(students));

    closeForm();
    displayStudents();
}

// Display Students

function displayStudents() {

    let table = document.getElementById("studentTable");

    let search = document.getElementById("search")
        .value.toLowerCase();

    table.innerHTML = "";

    let filtered = students.filter(student =>
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.course.toLowerCase().includes(search)
    );

    filtered.forEach(student => {

        let index = students.findIndex(s => s.id === student.id);

        table.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${escapeHTML(student.name)}</td>
                <td>${escapeHTML(student.email)}</td>
                <td>${escapeHTML(student.course)}</td>

                <td class="${student.status === 'Active' ? 'status' : 'inactive'}">
                    ${student.status}
                </td>

                <td>
                    <button class="edit" onclick="editStudent(${index})">
                        Edit
                    </button>

                    <button class="delete" onclick="deleteStudent(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

    document.getElementById("totalStudents").innerText =
        students.length;

    document.getElementById("activeStudents").innerText =
        students.filter(s => s.status === "Active").length;

    document.getElementById("inactiveStudents").innerText =
        students.filter(s => s.status === "Inactive").length;

}

// Prevent HTML injection in student text

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Edit Student

function editStudent(index) {

    let student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("course").value = student.course;
    document.getElementById("status").value = student.status;

    editIndex = index;

    document.getElementById("formTitle").innerText = "Edit Student";

    openForm();
}

// Delete Student

function deleteStudent(index) {

    if (confirm("Are you sure you want to delete this student?")) {

        students.splice(index, 1);

        localStorage.setItem("students", JSON.stringify(students));

        displayStudents();
    }
}

// Initial Display

displayStudents();