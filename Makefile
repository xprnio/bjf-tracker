# BJF Tracker

bin/bjf-tracker:
	rm -rf bin && mkdir bin
	bun build ./src/index.ts --compile --outfile bin/bjf-tracker

.PHONY: install install-bin install-systemd
install: install-bin install-systemd

install-bin: bin/bjf-tracker
	cp bin/bjf-tracker $$HOME/.local/bin/

install-systemd:
	cat systemd/bjf-tracker.service \
		| bun scripts/env-resolve.ts \
		> $$HOME/.config/systemd/user/bjf-tracker.service
	cat systemd/bjf-tracker.timer \
		| bun scripts/env-resolve.ts \
		> $$HOME/.config/systemd/user/bjf-tracker.timer
	systemctl --user daemon-reload
	systemctl --user enable --now bjf-tracker.timer

trigger:
	systemctl --user start bjf-tracker.service
