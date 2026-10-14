# Fusion Drop Runner

A phone app for delivery drivers. Photograph each numbered delivery note to build the day's drops, get one-tap directions to every stop, and see the run's road miles and drive time.

- Delivery notes are read on the phone itself. Photos and customer details are not sent anywhere.
- Each driver's run is saved on their own phone. Nobody sees anyone else's drops.
- Works with a weak signal once installed (directions and road miles need a connection).

## Settings for everyone: `config.js`

Open `config.js` on GitHub, click the pencil to edit, change the values between the quotes, then **Commit changes**.

| Setting | What it does |
|---|---|
| `googleKey` | Google Maps key for exact road miles and drive times. Empty = postcode estimates. |
| `depot` | Depot postcode every run starts from and returns to. |
| `email` | Address the end-of-day report is emailed to (drivers can change it in the app). |
| `stopMins` | Minutes spent at each drop. |

Drivers pick up changes the next time they open the app with a signal.

## Put it online (GitHub Pages)

1. On github.com, click **+** (top right) > **New repository**. Name it `drop-runner`, set it to **Public**, tick nothing else, and click **Create repository**.
2. On the new repo page, click **uploading an existing file**.
3. Unzip `fusion-drop-runner.zip` on your computer, open the folder, select **everything inside it** (including the `icons` and `ocr` folders) and drag it onto the GitHub page. Wait for all files to finish, then click **Commit changes**.
4. Go to **Settings** > **Pages**. Under *Build and deployment*, set **Source** to *Deploy from a branch*, **Branch** to `main` and `/ (root)`, then **Save**.
5. After a minute or two the page shows the address, like `https://YOURNAME.github.io/drop-runner/`. That's the link for the drivers.

## Google key for exact miles (optional)

1. Go to console.cloud.google.com and sign in with the company Google account. Create a project (e.g. "Drop Runner").
2. Set up billing for the project. Google needs a card on file even though normal use stays within the free monthly allowance.
3. Open **APIs & Services** > **Library**, search **Routes API**, and click **Enable**.
4. Open **APIs & Services** > **Credentials** > **Create credentials** > **API key**. Copy the key.
5. Click the key to restrict it:
   - **Application restrictions**: *Websites*, and add `https://YOURNAME.github.io/*`
   - **API restrictions**: *Restrict key*, tick **Routes API** only
   - Save.
6. Paste the key into `googleKey` in `config.js` and commit.
7. Recommended: in **Billing** > **Budgets & alerts**, set a small budget (e.g. £5) with email alerts.

The key is visible to anyone who opens the app's files, which is normal for map keys. The website restriction in step 5 stops it being used anywhere else.

## Install on a phone

**Android (Chrome):** open the link, tap **⋮** > **Install app** (or **Add to Home screen**).
**iPhone (Safari):** open the link, tap **Share** > **Add to Home Screen**.

It then opens full screen from its own icon.

## Updating the app

Upload the changed file(s) over the old ones on GitHub (**Add file** > **Upload files**). Drivers get the new version the next time they open the app with a signal; occasionally they may need to close and reopen it twice.
