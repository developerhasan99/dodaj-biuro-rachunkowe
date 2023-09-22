import polandProvinces from "./provinces";

// Select Elements for DOM
const provinceSelector = document.getElementById("province");
const citySelector = document.getElementById("city");

// Initially create options from the provinces object
for (const province in polandProvinces) {
	const provinceOption = document.createElement("option");
	provinceOption.setAttribute("value", province);
	provinceOption.innerText = province;

	provinceSelector.appendChild(provinceOption);
}

// Add onChange event listener on provinceSelector
provinceSelector.addEventListener("change", (e) => {
	const currentProvince = e.target.value;
	const cities = polandProvinces[currentProvince].sort();

	citySelector.innerHTML = "";
	citySelector.removeAttribute("disabled", false);

	cities.forEach((city) => {
		const cityOption = document.createElement("option");
		cityOption.setAttribute("value", city);
		cityOption.innerText = city;
		citySelector.appendChild(cityOption);
	});
});

// Handle form submission
const addAccountingOfficeForm = document.getElementById("addAccountingOffice");
const submitBtn = document.querySelector(
	'#addAccountingOffice button[type="submit"]'
);
const loadingSpinner = document.querySelector(
	'#addAccountingOffice button[type="submit"] .spinner-border'
);
const successAlert = document.querySelector(".alert.alert-success");
const dangerAlert = document.querySelector(".alert.alert-danger");

addAccountingOfficeForm.addEventListener("submit", function (e) {
	e.preventDefault();

	// Validate form fields
	const isValid = validateForm(e.target);
	if (!isValid) {
		return;
	}

	submitBtn.setAttribute("disabled", true);
	loadingSpinner.style.display = "inline-block";
	successAlert.style.display = "none";
	dangerAlert.style.display = "none";

	const formData = new FormData(this);
	formData.append("action", "add_accounting_office_frontend");

	fetch("/wp-admin/admin-ajax.php", {
		method: "POST",
		body: formData,
	})
		.then((res) => res.json())
		.then((data) => {
			submitBtn.removeAttribute("disabled");
			loadingSpinner.style.display = "none";
			this.reset();
			if (data.success) {
				successAlert.style.display = "block";
			} else {
				dangerAlert.style.display = "block";
			}
		})
		.catch((err) => {
			submitBtn.removeAttribute("disabled");
			loadingSpinner.style.display = "none";
			dangerAlert.style.display = "block";
		});
});

function validateForm(form) {
	// Get dom elements to show error
	const nameGroup = document.querySelector(".name-group");
	const emailGroup = document.querySelector(".email-group");
	const provinceGroup = document.querySelector(".province-group");
	const policyGroup = document.querySelector(".policy-group");

	let isValidName = checkField(form.name.value, nameGroup);
	let isValidEmail = checkField(form.email.value, emailGroup);
	let isValidProvince = checkField(form.province.value, provinceGroup);
	let isCheckedPolicy = false;

	if (form.policy_check.checked) {
		policyGroup.classList.remove("is-invalid");
		isCheckedPolicy = true;
	} else {
		policyGroup.classList.add("is-invalid");
	}

	return isValidName && isValidEmail && isValidProvince && isCheckedPolicy;
}

function checkField(value, inputGroup) {
	if (value) {
		inputGroup.classList.remove("is-invalid");
		return true;
	}
	inputGroup.classList.add("is-invalid");
	return false;
}
