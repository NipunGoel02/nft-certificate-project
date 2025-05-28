# Setting up Windows Task Scheduler to Run updateHackathonStatus.js Automatically

This guide explains how to schedule the `updateHackathonStatus.js` script to run automatically on Windows 10/11 using Task Scheduler.

## Prerequisites
- Node.js installed and added to your system PATH.
- The project directory path (e.g., `C:\Users\nipun goel\Downloads\nft certificate project\nft-certificate`).

## Steps

1. **Open Task Scheduler**
   - Press `Win + R`, type `taskschd.msc`, and press Enter.

2. **Create a New Task**
   - In the Task Scheduler window, click on **"Create Task..."** on the right panel.

3. **General Tab**
   - Name: `Update Hackathon Status`
   - Description: `Runs the script to update hackathon statuses automatically.`
   - Select **"Run whether user is logged on or not"**.
   - Check **"Run with highest privileges"**.

4. **Triggers Tab**
   - Click **"New..."**.
   - Begin the task: **On a schedule**.
   - Set the schedule (e.g., Daily, repeat every 1 day).
   - Set the start time (e.g., 12:00 AM).
   - Click **OK**.

5. **Actions Tab**
   - Click **"New..."**.
   - Action: **Start a program**.
   - Program/script: Enter the path to your Node.js executable, e.g.:
     ```
     C:\Program Files\nodejs\node.exe
     ```
   - Add arguments: Enter the path to the script relative to your project folder, e.g.:
     ```
     backend\scripts\updateHackathonStatus.js
     ```
   - Start in: Enter the full path to your project folder, e.g.:
     ```
     C:\Users\nipun goel\Downloads\nft certificate project\nft-certificate
     ```
   - Click **OK**.

6. **Conditions and Settings Tabs**
   - Adjust any conditions or settings as needed (default settings usually suffice).

7. **Save the Task**
   - Click **OK** to save the task.
   - You may be prompted to enter your Windows user password.

## Testing the Task
- In Task Scheduler, right-click the task and select **Run**.
- Check the task history or logs to confirm it ran successfully.
- Verify in your database that hackathon statuses have been updated.

---

If you want, I can help you create a script or command to verify the task or assist with any other setup.
