# Releasing a new version of the prototype kit

1. Checkout main and pull latest changes.

2. Decide on a new version number. Do this by looking at the [current "Unreleased" CHANGELOG](../CHANGELOG.md) changes and updating the previous release number depending on the kind of entries:

When you fix a bug and your code stays backwards compatible, increase the patch component:

```
v0.0.3 // Before bugfix
v0.0.4 // After bugfix
```

When you add functionality and your code stays backwards compatible, increase the minor component and reset the patch component to zero:

```
v0.2.4 // Before addition of new functionality
v0.3.0 // After addition of new functionality
```

When you implement changes and your code becomes backwards incompatible, increase the major component and reset the minor and patch components to zero:

```
v7.3.5 // Before implementing backwards incompatible changes
v8.0.0 // After implementing backwards incompatible changes
```

(From [jvandemo.com](https://www.jvandemo.com/a-simple-guide-to-semantic-versioning/))

3. Draft release notes in a Google Doc.

4. Checkout a new branch called release-[new version number].

5. If the major version has changed make sure it's updated for the plugins in `GOVUKPrototypeKit.majorVersion` (JS) and `$govuk-prototype-kit-major-version` (SASS).

6. Update the [CHANGELOG.md](../../CHANGELOG.md) by:

  - adding the text of the release notes under the 'Unreleased' heading
  - changing the 'Unreleased' heading to the new version-number - for example, '12.0.1'
  - adding a new 'Unreleased' heading above the new version-number, so users will know where to add PRs to the changelog

7. Update the version number in [package.json](../../package.json).

8. Run `npm install` to update `npm-shrinkwrap.json`.

9. Commit your changes and open a new pull request on GitHub - copy the release notes into the description.

10. Once someone has merged the pull request, [draft a new release on GitHub](https://github.com/alphagov/govuk-prototype-kit/releases)

11. In Tag version and Release title, put v[version number], for example `v7.0.0`.

12. In the description, paste the relevant section from the release notes in the Google Doc.

13. Checkout the *main* branch and pull the latest changes.

14. Sign in to npm (`npm login`), using the credentials for the govuk-prototype-kit npm user from Bitwarden.

15. Run `npm run clean-publish` and enter the one-time password when prompted.

16. Run `npm logout` to log out from npm.

17. On GitHub, click 'Publish release'.

18. Let the community know about the release

Write a brief summary with highlights from the release then send it to the following slack channels:

- X-GOV #govuk-design-system
- X-GOV #prototype-kit
- GDS #govuk-design-system
- GDS #product-and-technology

Make sure to send a link to the 'create a new prototype' page rather than the GitHub release page: https://prototype-kit.service.gov.uk/docs/create-a-new-prototype.

19. On the sprint board, move everything that's been released from the Ready for release column to the Done column
