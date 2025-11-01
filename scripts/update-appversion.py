#!/usr/bin/env python3
"""
Update appVersion in Chart.yaml to match version after bumpversion runs.
"""
import re
import sys

def update_chart_appversion(chart_path):
    """Update appVersion to match version in Chart.yaml"""
    with open(chart_path, 'r') as f:
        content = f.read()

    # Extract the version value
    version_match = re.search(r'^version:\s+([^\s]+)$', content, re.MULTILINE)
    if not version_match:
        print(f"Error: Could not find version in {chart_path}")
        sys.exit(1)

    version = version_match.group(1)

    # Update appVersion to match version
    updated_content = re.sub(
        r'appVersion:\s+"[^"]+"',
        f'appVersion: "{version}"',
        content
    )

    if updated_content == content:
        print(f"Warning: appVersion not found or already matches in {chart_path}")
        return

    with open(chart_path, 'w') as f:
        f.write(updated_content)

    print(f"Updated appVersion to {version} in {chart_path}")

if __name__ == '__main__':
    update_chart_appversion('charts/agentarea/Chart.yaml')
