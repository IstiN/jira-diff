# JD-111: Extended Project Information on index.html

## Test Objective

Verify the presence of extended project information on the index.html page.

## Prerequisites

1. Install dependencies from the testing root:

```bash
cd testing
pip install -r requirements.txt
playwright install chromium
```

2. Ensure the `web/index.html` file exists in the project root.

## How to Run

From the project root:

```bash
cd testing
pytest tests/JD-111/test_jd_111.py -v
```

Or from the testing folder:

```bash
pytest tests/JD-111/test_jd_111.py -v
```

## Environment

- No environment variables required
- Uses `file://` URL to load the local `web/index.html`
- Runs in headless Chromium by default

## Expected Output (Pass)

```
tests/JD-111/test_jd_111.py::test_extended_project_info_on_index_page PASSED
```
